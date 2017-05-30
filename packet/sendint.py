import socket
import sys
import random
import time

def sendSocket(port):
    s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    s.connect(('10.0.0.3',port))
    print('socket connected %d'%port)
    str=''
    print('send string %s'%str)
    s.send(str)
    s.close()
    # print('socket closed')

def decide():
    rand=random.randint(0,1)
    portArr=[2222,2223]
    return portArr[rand]

num=sys.argv[1]
for i in range(int(num)):
    print('packet %d'%i)
    port=decide()
    sendSocket(port)
    time.sleep(1)