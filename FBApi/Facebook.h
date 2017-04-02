#include "QString"
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"
#include "fbauthwnd.h"
#include <QtWidgets>
#include "QObject"

class Facebook: public QObject
{
    Q_OBJECT
public:
    Facebook(QString _app_id, QString _app_secret);
    void showAuthWindow();

protected slots:
    void getCode(QString);

private:
    QString app_id;
    QString app_secret;
    QString tocken;
    QString code;
    bool authFlag;
    FBAuthWnd* FBwnd;
    void getTocken();
};
