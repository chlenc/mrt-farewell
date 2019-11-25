FROM nginx:stable
COPY ./ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t
