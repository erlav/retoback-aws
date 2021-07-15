FROM node:alpine3.12
RUN apk update; apk add gcc g++ cmake make
WORKDIR /root/app
ADD . ./
RUN npm install
CMD ["npm","start"]