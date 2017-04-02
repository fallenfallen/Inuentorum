#ifndef UASSESSOR_H
#define UASSESSOR_H


#include <QObject>


class UAssessor : public QObject
{
    Q_OBJECT


public:

    explicit UAssessor (QObject *parent = Q_NULLPTR);
    ~UAssessor ();
};


#endif // UASSESSOR_H
