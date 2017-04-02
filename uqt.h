#ifndef UQT_H
#define UQT_H


#include <QObject>


class UQt : public QObject
{
    Q_OBJECT


public:

    explicit UQt (QObject *parent = 0);
    ~UQt ();

    Q_INVOKABLE QString loadResource (const QString &path);
};


#endif // UQT_H
