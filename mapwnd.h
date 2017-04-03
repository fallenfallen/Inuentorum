#include <QtWidgets>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"
#include "FBApi/Facebook.h"
#include "umap.h"


QT_BEGIN_NAMESPACE
class QWebEngineView;
QT_END_NAMESPACE

class MapWnd : public QMainWindow
{
    Q_OBJECT

    UMap *map;
    Facebook* fb;


public:
     explicit MapWnd(QWidget *parent = Q_NULLPTR);
     ~MapWnd();


protected slots:

    void facebookAuth();
    void onfbloggedIn();
};
