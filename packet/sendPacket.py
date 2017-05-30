import socket
import sys
import random
import time

def sendSocket(port,ss):
    s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    s.connect(('10.0.0.3',port))
    # s.connect(('127.0.0.1',port))
    print('socket connected %d'%port)
    print('send string %s'%ss)
    s.send(ss)
    s.close()
    # print('socket closed')

def decide():
    rand=random.uniform(0,8)
    portArr=[3333,3334,3335,3336]
    if(rand<1):
        return portArr[0]
    elif(rand<2):
        return portArr[1]
    elif(rand<4):
        return portArr[2]
    elif(rand<8):
        return portArr[3]

packetNum=sys.argv[1]
for i in range(int(packetNum)):
    print('packet %d'%i)
    port=decide()
    print(port)
    ss='num:'+str(i)+' port:'+str(port)
    sendSocket(port,ss)
    # time.sleep(0.1)