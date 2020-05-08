// ==UserScript==
// @name         Firebase - redirect on error
// @namespace    https://github.com/evilDave/tampermonkey-firebase/blob/master/onErrorRedirect.js
// @version      1.0
// @description  on Firebase error, redirect calls for user n to user n+1
// @author       David Clark
// @include      https://console.firebase.google.com/u/*
// @exclude      *alternategtm.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

'use strict'
/* global $ */

const waitTime = 100
const wantedFirebaseUser = 'wantedFirebaseUser'

const location = window.location.href // grab the location on first load as the error only is added after the reditect to the user root
const match = location.match(/\/u\/(\d)\//) // check that we have an incrementable user id
const currentUser = Number(match[1])
const nextUser = currentUser + 1
const target = match && location.replace(/\/u\/\d\//, `/u/${nextUser}/`) // the next user to target if needed

let interval

const redirectOnError = () => {
    // check if this is an error page
    const error = !!$('[class*="fire-error-page"]').length
    if (error) {
        GM_setValue(wantedFirebaseUser, nextUser)
        window.location.replace(target)
    } else {
        GM_deleteValue(wantedFirebaseUser)
    }
}

// try to wait for the Firebase app to finish rendering the page
const waitForFirebase = () => {
    const router = $('fire-router-outlet')[0]
    if (!router) {
        // does not seem to be the Firebase console app
        clearInterval(interval)
        return
    }
    // wait for the async filling of the router node (seems to be 4...)
    const ready = router && router.childNodes.length > 4
    if (ready) {
        clearInterval(interval)
        redirectOnError()
    }
}

// only do something if it looks like we can help...
if (match) {
    // make sure we are not in a loop
    const wantedUser = GM_getValue(wantedFirebaseUser)
    if (wantedUser === undefined || currentUser === wantedUser) {
        // only do this if we didn't redirect here (no wantedUser) or it was successful (i.e. redirecting to /u/2/ when it does not exist will end up on /u/0/)
        interval = setInterval(waitForFirebase, waitTime)
    } else {
        GM_deleteValue(wantedFirebaseUser)
    }
}
