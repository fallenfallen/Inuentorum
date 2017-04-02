#ifndef UQT_H
#define UQT_H


#include "uassessor.h"
#include <QObject>


class UQt : public QObject
{
    Q_OBJECT

    UAssessor *assessor;


public:

    explicit UQt (QObject *parent = Q_NULLPTR);
    ~UQt ();

    Q_INVOKABLE QString evaluateTrack (const QString &);
};


#endif // UQT_H
