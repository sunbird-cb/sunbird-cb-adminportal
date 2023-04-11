export const environment = {
  production: true,
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  name: (window as { [key: string]: any })['env']['name'],
  cbpProviderRoles: (window as { [key: string]: any })['env']['cbpProvidersRoles'] || [],
  userBucket: (window as { [key: string]: any })['env']['userBucket'] || '',
  departments: (window as { [key: string]: any })['env']['departments'] || [],
}
