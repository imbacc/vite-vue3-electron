export const log = (message?: any, ...optionalParams: any[]) => {
  requestIdleCallback(() => {
    console.log(`%c [ ${message} ]`, 'font-size:14px; background:#41b883; color:#ffffff;', ...optionalParams)
  })
}