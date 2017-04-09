#ifndef UQT_H
#define UQT_H


#include <QObject>
#include "FBApi/Facebook.h"


class UQt : public QObject
{
    Q_OBJECT

    bool loginFacebookEmitted = false;


public:

    Facebook* fb;

    explicit UQt (QObject *parent = Q_NULLPTR);
    ~UQt ();


signals:

    void loginFacebook ();


public slots:

    void loginFacebookSlot ();
};


#endif // UQT_H
