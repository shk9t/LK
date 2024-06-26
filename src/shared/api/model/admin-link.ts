export interface AdminLink {
    title: string
    url: string
}

export type AdminLinks = {
    accepts: AdminLink[]
    agreements: AdminLink[]
    checkdata: AdminLink[]
    phonebook: AdminLink[]
    // is absent in api
    studLogins: AdminLink[]
}
