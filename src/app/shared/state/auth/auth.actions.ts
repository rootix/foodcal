export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: { username: string; password: string }) {}
}
