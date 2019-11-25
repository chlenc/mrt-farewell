FROM node:10 as dist

COPY . /
RUN npm ci && npm run build

FROM nginx:latest

COPY nginx-lot.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=dist /dist /usr/share/nginx/dist
RUN nginx -t
