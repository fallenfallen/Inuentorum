#ifndef UQT_H
#define UQT_H


#include <QObject>


class UQt : public QObject
{
    Q_OBJECT

    bool loginFacebookEmitted = false;


public:
    explicit UQt (QObject *parent = Q_NULLPTR);


signals:

    void loginFacebook ();


public slots:

    void loginFacebookSlot ();
};


#endif // UQT_H
