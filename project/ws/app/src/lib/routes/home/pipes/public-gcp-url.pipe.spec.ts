import { PublicGcpUrlPipe } from './public-gcp-url.pipe'

describe('PublicGcpUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new PublicGcpUrlPipe()
    expect(pipe).toBeTruthy()
  })
})
