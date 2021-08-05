import { Transform } from 'stream'

interface Credentials {
    accessKeyId?: string
    secretAccessKey?: string
    sessionToken?: string
}

interface Options {
    distribution: string
    states?: string[]
    originPath?: string
    wait: boolean
    indexRootPath: boolean
    credentials?: Credentials
    accessKeyId?: string
    secretAccessKey?: string
    sessionToken?: string
}

export default function (options: Options): Transform