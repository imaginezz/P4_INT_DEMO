import socket

s=[]
def socketAppend(port):
    s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
    s.bind(('0.0.0.0',port))
    return s

portArr=[3333,3334,3335,3336]
for i in range(len(portArr)):
    s.append(socketAppend(portArr[i]))

print('socket server is running...')
print(s)

def receiveData():
    for i in range(len(s)):
        (data,addr)=s[i].recvfrom(2048)
        print('accept a new connection from %s:%s'%addr)
        print(data)

while True:
    receiveData()

for i in range(len(s)):
    s[i].close()