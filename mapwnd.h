#include <QtWidgets>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"
#include "FBApi/Facebook.h"


QT_BEGIN_NAMESPACE
class QWebEngineView;
QT_END_NAMESPACE

class MapWnd : public QMainWindow
{
    Q_OBJECT

public:
     MapWnd(const QUrl& url);
     ~MapWnd();

protected slots:
    void finishLoading(bool);
    void findLocation();
    void facebookAuth(bool);
    void loadfriends();

private:
    QWebEngineView *view;
    Facebook* fb;
    QPushButton* authButt;
};
