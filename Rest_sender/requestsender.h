#ifndef REQUESTSENDER_H
#define REQUESTSENDER_H

#include "request.h"
#include <QNetworkProxy>
#include <QObject>
#include <QTimer>
#include <QNetworkAccessManager>
#include <QEventLoop>
#include <QNetworkReply>
#include <QThread>

class RequestSender : public QObject
{
    Q_OBJECT
public:
    enum RequestError
    {
        NoError,
        TimeoutError
    };
    RequestSender(qint64 maxWaitTime = 35000);
    ~RequestSender();
    void setProxy(const QNetworkProxy& proxy);
    QByteArray get(Request& request);
    QByteArray post(Request& request);
    QByteArray getWhileSuccess(Request& request, int maxCount = 2);
    QByteArray postWhileSuccess(Request& request, int maxCount = 2);
    void setMaxWaitTime(qint64 max);
    qint64 maxWaitTime() const;
    RequestError error() const;
    private:
    QByteArray sendRequest(Request& request, bool getRequest = true);
    QByteArray sendWhileSuccess(Request& request, int maxCount = 2, bool getRequest = true);
    private:
    qint64 _maxWaitTime;
    RequestError _error;
    QNetworkProxy _proxy;
};

#endif // REQUESTSENDER_H
