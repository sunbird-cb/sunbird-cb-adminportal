export const environment: IEnvironment = {
  production: false,
  sitePath: '',
  karmYogiPath: '',
  portalRoles: [],
  name: '',
  cbpProviderRoles: [],
  userBucket: '',
  departments: [],
  contentHost: '',
  contentBucket: '',
  spvPath: '',
  connectionType: '',
  KCMframeworkName: '',
}

interface IEnvironment {
  contentBucket: any
  contentHost: any
  name: string
  production: boolean
  sitePath: null | string
  karmYogiPath: string
  portalRoles: string[]
  cbpProviderRoles: string[]
  userBucket?: string
  departments?: string[]
  spvPath?: string
  connectionType?: string
  KCMframeworkName?: string
}