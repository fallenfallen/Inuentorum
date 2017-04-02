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
    Facebook(QString _app_id, QString _app_secret);
    void showAuthWindow();
    UserData getUserData();
    bool isAuth();
    void logout();

protected slots:
    void getCode(QString);

signals:
    void completed();

private:
    QString getUserId();
    QString getUserName();
    QString getUserPhoto();
    QString app_id;
    QString app_secret;
    QString tocken;
    QString code;
    bool authFlag;
    FBAuthWnd* FBwnd;
    void getTocken();
};
