#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sqlite3.h>
#include <time.h>
#include <pthread.h>

#define headerSize 23
#define fieldNum 8

void doBinTrans(char message[], int startPos, int size, char binstr[]);
void doBin2Str(char binarr[], char binstr[]);
void doFormatStr(char binstr[], char formattedStrArr[][8 * 8]);
static int callback(void *NotUsed, int argc, char **argv, char **azColName);
// void doInsertSql(void *arg);

int main(int argc, char **argv)
{
    int port;
    if (argc != 2)
    {
        printf("you should enter port\n");
        exit(0);
    }
    else
    {
        port = atoi(argv[1]);
        printf("receive port is %d \n", port);
    }
    sqlite3 *db;
    char *zErrMsg = 0;
    int rc;
    char sql[256];
    rc = sqlite3_open("int.db", &db);
    if (rc)
    {
        fprintf(stderr, "can't open db %s \n", sqlite3_errmsg(db));
        exit(0);
    }
    else
    {
        fprintf(stdout, "database opend\n");
    }

    int sin_len;
    char message[255];
    int socket_descriptor;
    struct sockaddr_in sin;

    printf("waiting for packet \n");
    bzero(&sin, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr("0.0.0.0");
    sin.sin_port = htons(port);
    sin_len = sizeof(sin);
    socket_descriptor = socket(AF_INET, SOCK_DGRAM, 0);
    bind(socket_descriptor, (struct sockaddr *)&sin, sizeof(sin));

    time_t timep;
    int packetId;
    // pthread_t threadId;
    // int threadRet;

    while (1)
    {
        time(&timep);
        srand((unsigned)timep);
        packetId = (int)timep + rand() % 1000;
        printf("time %d ,packetId %d \n", (int)timep, packetId);

        memset(message, 0, sizeof(message));
        int rsize = recvfrom(socket_descriptor, message, sizeof(message), 0, (struct sockaddr *)&sin, &sin_len);
        printf("received %d byte data \n", rsize);
        int headerNum = rsize / headerSize;
        char binarr[headerSize * fieldNum];
        char binstr[headerSize * fieldNum + 1];
        char formattedStrArr[fieldNum][fieldNum * fieldNum];
        int i;
        printf("header num %d\n", headerNum);
        for (i = 0; i < headerNum; i++)
        {
            printf("header no:%d \n", i);
            binstr[0] = '\0';
            doBinTrans(message, i * headerSize, headerSize, binarr);
            doBin2Str(binarr, binstr);
            doFormatStr(binstr, formattedStrArr);

            sprintf(sql,
                    "insert into int "
                    "(intFlag,ingress_port,egress_port,ingress_global_timestamp,enq_timestamp,enq_qdepth,deq_timedelta,deq_qdepth,port,timestamp,packet_id)"
                    " values ('%s','%s','%s','%s','%s','%s','%s','%s','%d','%d','%d');",
                    formattedStrArr[0], formattedStrArr[1], formattedStrArr[2], formattedStrArr[3], formattedStrArr[4], formattedStrArr[5], formattedStrArr[6], formattedStrArr[7],
                    port, (int)timep, packetId);
            // ret = pthread_create(&id, NULL, (void *)doInsertSql, NULL);
            // if (ret != 0)
            // {
            //     printf("create pthread error!\n");
            //     exit(1);
            // }
            rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
            while (rc != SQLITE_OK)
            {
                fprintf(stderr, "SQL error: %s\n", zErrMsg);
                sqlite3_free(zErrMsg);
                rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
            }
            // if (rc != SQLITE_OK)
            // {
            //     fprintf(stderr, "SQL error: %s\n", zErrMsg);
            //     sqlite3_free(zErrMsg);
            // }
            // else
            // {
            //     fprintf(stdout, "record inserted \n");
            // }
            fprintf(stdout, "record inserted \n");
        }
    }
    close(socket_descriptor);
    sqlite3_close(db);
    exit(0);
    return (EXIT_SUCCESS);
}

void doBinTrans(char message[], int startPos, int size, char binarr[])
{
    // printf("start pos :%d \n", startPos);
    int i;
    int m = 0;
    for (i = startPos; i < size + startPos; i++)
    {
        // printf("\ni=%d\n", i);
        char j, k;
        for (j = 7; j >= 0; j--)
        {
            // printf("\nj=%d  ", j);
            k = message[i] >> j;
            binarr[m] = k & 1;
            // printf("%d", binarr[m]);
            m++;
        }
    }
}

void doBin2Str(char binarr[], char binstr[])
{
    char st[2];
    int i;
    for (i = 0; i < headerSize * fieldNum; i++)
    {
        sprintf(st, "%d", binarr[i]);
        strcat(binstr, st);
    }
    // printf("str: %s \n",binstr);
}

void doFormatStr(char binstr[], char formattedStrArr[][8 * 8])
{
    printf("str: %s \n", binstr);
    int hdrLen[] = {6, 9, 9, 48, 48, 16, 32, 16};
    char tmpFormat[fieldNum * fieldNum];
    int position = 0;
    int i;
    for (i = 0; i < fieldNum; i++)
    {
        int j;
        for (j = 0; j < hdrLen[i]; j++)
        {
            tmpFormat[j] = binstr[position + j];
        }
        tmpFormat[j] = '\0';
        position += hdrLen[i];
        strcpy(formattedStrArr[i], tmpFormat);
        printf("str %s j=%d\n", formattedStrArr[i], j);
    }
}

static int callback(void *NotUsed, int argc, char **argv, char **azColName)
{
    int i;
    for (i = 0; i < argc; i++)
    {
        printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}

// void doInsertSql(void *arg)
// {
//     int i;
//     for (i = 0; i < 3; i++)
//     {
//         sleep(1);
//         printf("this is in a thread\n");
//     }
// }