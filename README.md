# tampermonkey-firebase
tampermonkey scripts for firebase

## why

Using multiple firebase accounts at the same time is problematic.

The user that you log in to google first with becomes `/u/0`, that may or may not be the user you normally want to access Firebase with.

E.g. I log in first to my gmail user (so that I can get chrome sync to work how I want it), then to my work account. That makes `/u/0` my gmail account and `/u/1` the work account, the one that I want to access mostly. Now other people on the team, have either only one account, or are happy logging into the work domain first, so they want `/u/0`. Links without `/u/?` specified go to `/u/0` which is no good for me. Links with `/u/1` specified will work for me, but not be right for everyone.

## what

This script detects the error page that gets shown when the firebase asset you are trying to open does not exist in the current account.

It then redirects to the "next" user (i.e. `/u/0` first, then `/u/1`, `/u/2`, etc.) trying to find it there.

Eventually, it will be found, or you will run out of valid users, the script should then stop with the error.
