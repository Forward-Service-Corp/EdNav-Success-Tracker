import { NextRequest, NextResponse } from 'next/server';
// import {cookies} from "next/headers";
import * as jose from 'jose';

let key = new TextEncoder().encode()

export async function encrypt(payload) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({
            "alg": 'HS256',
            "typ": "JWT"
        })
        .setIssuedAt()
        .setExpirationTime('1 minute from now')
        .sign(key)
}

export async function decrypt(input) {
    return await jose.jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
}

// export async function login({email, pin, fName, lName, level, phone, programs}) {
//     const user = {
//         email: email,
//         pin: pin,
//         fName: fName || '',
//         lName: lName || '',
//         level: level || '',
//         phone: phone || '',
//         programs: programs || [],
//     };
//     const expires = new Date(Date.now() + 100 * 1000);
//     const session = await encrypt({user, expires});
//      (await cookies()).set(
//         'session',
//         session,
//         {expires, httpOnly: true});
// }
//
// export async function logout() {
//      (await cookies()).set('session', '', { expires: new Date(0) });
// }



export async function updateSession(request) {
    const thisSession = new NextRequest(request)
    const session = await request.cookies.get(thisSession)?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}


