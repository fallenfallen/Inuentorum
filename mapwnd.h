#include <QtWidgets>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"

QT_BEGIN_NAMESPACE
class QWebEngineView;
QT_END_NAMESPACE

class MapWnd : public QMainWindow
{
    Q_OBJECT

public:
     MapWnd(const QUrl& url);

protected slots:
    void finishLoading(bool);
    void findLocation();

private:
    QWebEngineView *view;
};
