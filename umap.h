
#ifndef UMAP_H
#define UMAP_H


#include "uqt.h"
#include <QWebView>


class UMap : public QWebView
{


public:

    UQt *qt;

    explicit UMap (QWidget *parent = Q_NULLPTR);
    ~UMap ();
};


#endif // UMAP_H
