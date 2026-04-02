import { UserModel } from '../models/User';
import { hashPassword } from '../utils/password';
import { config } from '../config/config';
import { UserRole } from '../../../shared/types';

function resolveBootstrapEmail(username: string): string {
  const normalized = username.trim().toLowerCase();

  if (normalized.includes('@')) {
    return normalized;
  }

  return `${normalized}@${config.adminBootstrap.emailDomain}`;
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const username = config.adminBootstrap.username?.trim();
  const password = config.adminBootstrap.password;

  if (!username || !password) {
    return;
  }

  const email = resolveBootstrapEmail(username);
  const hashedPassword = await hashPassword(password);

  const existing = await UserModel.findOne({ email });

  if (!existing) {
    await UserModel.create({
      email,
      password: hashedPassword,
      firstName: config.adminBootstrap.firstName,
      lastName: config.adminBootstrap.lastName,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    console.log(`✓ Bootstrap admin created: ${email}`);
    return;
  }

  existing.password = hashedPassword;
  existing.firstName = config.adminBootstrap.firstName;
  existing.lastName = config.adminBootstrap.lastName;
  existing.role = UserRole.ADMIN;
  existing.isEmailVerified = true;
  existing.isActive = true;
  await existing.save();

  console.log(`✓ Bootstrap admin updated: ${email}`);
}
