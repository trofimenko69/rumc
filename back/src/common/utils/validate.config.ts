import { z } from 'zod';

const host = () =>
  z.union([z.string().ip(), z.string().url(), z.literal('localhost')]);

const port = () => z.number().min(1).max(65_535);

export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: host(),
  POSTGRES_PORT: port(),
  POSTGRES_DATABASE: z.string(),
  API_PORT: port(),
  API_VERSION: z.string(),
  API_PREFIX: z.string(),
  SWAGGER_TITLE: z.string(),
  SWAGGER_DESCRIPTION: z.string(),
  SWAGGER_PATH: z.string(),
  JWT_SECRET: z.string(),
  ORIGIN_URL: z.string(),
});

export const validateAppConfig = <TConfig extends Record<string, unknown>>(
  config: TConfig,
) => appConfigSchema.parse(config);

export type AppConfigSchema = z.infer<typeof appConfigSchema>;
