import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
import scipy

font = {'family' : 'normal',
        'weight' : 'bold',
        'size'   : 20}

plt.rc('font', **font)
matplotlib.style.use('ggplot')
my_data =pd.read_csv('mrtDistribution.txt',  sep=' ')
sortedMRT =  my_data.sort_values(by = ["mrt"])



mrt = my_data['mrt'].sort_values()/100
print(mrt.mean(),mrt.median())
plt.xlim([0, 600000])
mrt.plot.kde()
plt.show()

rang = range(len(mrt))
plt.xlim([0, 31000])
plt.scatter(rang, mrt,s = 1) 
plt.show()

mrtDig = 100
print(1, len(my_data[my_data['mrt'] > 1*mrtDig]),sum(my_data[my_data['mrt'] > 1*mrtDig]["mrt"]))
print(10,len(my_data[my_data['mrt'] > 10*mrtDig ]),sum(my_data[my_data['mrt'] > 10*mrtDig]["mrt"]))
print(100,len(my_data[my_data['mrt'] > 100*mrtDig ]),sum(my_data[my_data['mrt'] > 100*mrtDig]["mrt"]))
print(250,len(my_data[my_data['mrt'] > 250*mrtDig ]),sum(my_data[my_data['mrt'] > 250*mrtDig]["mrt"]))
print(500,len(my_data[my_data['mrt'] > 500*mrtDig ]),sum(my_data[my_data['mrt'] > 500*mrtDig]["mrt"]))
print(1000,len(my_data[my_data['mrt'] > 1000*mrtDig ]),sum(my_data[my_data['mrt'] > 1000*mrtDig]["mrt"]))
print(10000,len(my_data[my_data['mrt'] > 10000*mrtDig  ]),sum(my_data[my_data['mrt'] > 10000*mrtDig]["mrt"]))
print(100000,len(my_data[my_data['mrt'] > 100000*mrtDig  ]),sum(my_data[my_data['mrt'] > 100000*mrtDig]["mrt"]))

#dataMassTr = my_data[my_data['Type'] == 11 ][my_data['Scripts'] >=1]




'''
print(np.mean(dataTransfer), np.std(dataTransfer), np.median(dataTransfer))
dataTransfer = np.sort(dataTransfer)
fit = stats.norm.pdf(dataTransfer, np.mean(dataTransfer), np.std(dataTransfer))

#pl.plot(dataTransfer,fit,'o') 
s = pd.Series(dataTransfer)
s.plot.kde()
plt.xlabel('Time')
plt.title('Transfer')
#std = np.std(dataTransfer_time) 
#mean = np.mean(dataTransfer_time)    
#pdf = norm.pdf(dataTransfer_time, mean, std)

#plt.plot(dataTransfer_time, pdf) 
plt.show()
'''