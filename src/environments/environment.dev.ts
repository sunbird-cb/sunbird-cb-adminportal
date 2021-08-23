export const environment = {
  production: true,
  sitePath: 'aastrika-sb-cbp.idc.tarento.com',
  //sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],

}
