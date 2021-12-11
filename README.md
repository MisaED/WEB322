API_KEY=43e0c98a-4d38-4b43-b577-84e9a9dda5cd

[heroku gitlab](https://youtu.be/aKCqbSnOQWI)
[handlebars medium](https://waelyasmina.medium.com/a-guide-into-using-handlebars-with-your-express-js-application-22b944443b65)
[handlebars partials&custom helper](https://www.youtube.com/watch?v=2BoSBaWvFhM)

[bootwatch](https://bootswatch.com/)

[medium-express-session](https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d)
[npm-express-session](https://www.npmjs.com/package/express-session)

```bash
$ docker run -p 0.0.0.0:5432:5432 --name dev-empdb -e POSTGRES_PASSWORD=password -d postgres
$ docker exec -it dev-empdb bash
$ psql -U postgres
$ create database emps;
```

```bash
$ curl --location --request POST 'localhost:5432/register' --header 'Content-Type: application/json' --data-raw '{"userName":"@john","email":"john@test.ca","password":"password", "password2":"password"}'

$ curl --location --request POST 'localhost:5432/login' --header 'Content-Type: application/json' --data-raw '{"userName":"@john","password":"password"}'

$ curl -X GET 'localhost:5432/login' -v

$ curl -X GET http://localhost:3000 -c cookie-file.txt
```

```bash
# cd ~
# .bash_profile
parse_git_branch() {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
PS1="🚀 $(tput setaf 015)\W/$(tput setaf 016)git:$(tput setaf 001)\$(parse_git_branch)\[\e[00m\] -> ";
# export PS1="\u@\h \[\e[32m\]\w \[\e[91m\]GIT\$(parse_git_branch)\[\e[00m\]$ "
export PS1;
```

```bash
# for Bash Customization
RED='[\e[1;31m]'
BOLDYELLOW='[\e[1;33m]'
GREEN='[\e[0;32m]'
BLUE='[\e[1;34m]'
DARKBROWN='[\e[1;33m]'
DARKGRAY='[\e[1;30m]'
CUSTOMCOLORMIX='[\e[1;30m]'
DARKCUSTOMCOLORMIX='[\e[1;32m]'
LIGHTBLUE="[\033[1;36m]"
PURPLE='[\e[1;35m]'
parse_git_branch() {
  git branch 2> /dev/null | sed -e '/^[^]/d' -e 's/ (.*)/ (\1)/'
}
export PS1="🐕 ${BLUE}\w${PURPLE} 🦄\$(parse_git_branch)${RED} ➜ ${LIGHTBLUE}"
# export PS1="🥷 ${BLUE}\w${PURPLE} 🎭\$(parse_git_branch)${RED} ➜ ${LIGHTBLUE}"
# export PS1="🚀 ${BLUE}\w${PURPLE} 🃏\$(parse_git_branch)${RED} ➜ ${LIGHTBLUE}"
```
