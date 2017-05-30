import socket
import struct

def encode(s):
    return ''.join([bin(ord(c)).replace('0b','') for c in s])

s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
s.bind(('0.0.0.0',2222))
print('socket server is running...')

while True:
    data,addr=s.recvfrom(2048)
    print('accept a new connection from %s:%s'%addr)
    print(data)
    print(encode(data))
    print('length',len(encode(data)))
    print(int(encode(data),2))
    print(hex(int(encode(data),2)))
    print('connection closed')

s.close()
