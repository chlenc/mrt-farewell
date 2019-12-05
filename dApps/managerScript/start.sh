#!/usr/bin/env bash

ts-node ./creation.ts
printf "\n\n"
ts-node ./buyTickets.ts
printf "\n\n"
ts-node ./lotteryAction.ts

