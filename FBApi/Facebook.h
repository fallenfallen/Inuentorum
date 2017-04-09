#include "QString"
#include "Rest_sender/request.h"
#include "Rest_sender/requestsender.h"
#include "fbauthwnd.h"
#include <QtWidgets>
#include "QObject"

struct UserData
{
    QString user_id;
    QString fullName;
    QString photoLnk;
};


class Facebook: public QObject
{
    Q_OBJECT
public:
    QString tocken;

    Facebook(QString _app_id, QString _app_secret);
    void showAuthWindow();
    UserData getUserData(QString id = "me");
    bool isAuth();
    void logout();
protected slots:
    void getCode(QString);

signals:
    void completed();

private:
    QString getUserId();
    QString getUserName(QString id);
    QString getUserPhoto(QString id);
    QString app_id;
    QString app_secret;
    QString code;
    bool authFlag;
    FBAuthWnd* FBwnd;
    void getTocken();
};
