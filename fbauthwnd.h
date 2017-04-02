#include <QtWidgets>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"
#include "QtWebChannel"
#include "QString"

QT_BEGIN_NAMESPACE
class QWebEngineView;
QT_END_NAMESPACE

class FBAuthWnd : public QMainWindow
{
    Q_OBJECT

public:
     FBAuthWnd();

signals:
     void sendCode(QString code);


protected slots:
    void finishLoading(bool);

private:
    QWebEngineView *wview;
    QString code;
};
