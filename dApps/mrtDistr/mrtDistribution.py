import requests
import json
import datetime

alreadry_in_list = []

with open("mrtDistribution.txt","w+") as f:
     f.write("address mrt\n")
    query = "https://nodes.wavesnodes.com/assets/4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC/distribution/1802788/limit/100"
    answer = requests.get(query)
    data = json.loads(str(answer.content.decode('utf8')))
    lastCursor = data["lastItem"]
    for address in data["items"]:
        mrtAmount = data["items"]
        [address]
        f.write(address +" "+ str(mrtAmount)+ "\n")
    for i in range(100000):
        query = "https://nodes.wavesnodes.com/assets/4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC/distribution/1802788/limit/100?after="+lastCursor
        answer = requests.get(query)
        data = json.loads(str(answer.content.decode('utf8')))
        lastCursor = data["lastItem"]
        for address in data["items"]:
            mrtAmount = data["items"][address]
            print(address, mrtAmount)
            f.write(address +" "+ str(mrtAmount)+ "\n")

'''   
	for i in data["data"]:
		if str(sender) not in alreadry_in_list:
			alreadry_in_list.append(sender)
			f.write(sender + "\n")
		lastCursor = data["lastItem"]
	for i in range(10000):
		query = " https://api.testnet.wavesplatform.com/v0/transactions/set-script?after="+ lastCursor +  "&sort=desc&limit=100"
		answer = requests.get(query)
		data = json.loads(str(answer.content.decode('utf8')))
		for i in data["data"]:
			sender = i["data"]["senderPublicKey"]
			if str(sender) not in alreadry_in_list:
				alreadry_in_list.append(sender)
				f.write(sender + "\n")
		lastCursor = data["lastCursor"]
'''