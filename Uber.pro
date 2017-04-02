#-------------------------------------------------
#
# Project created by QtCreator 2017-04-02T09:10:51
#
#-------------------------------------------------

QT       += core gui webenginewidgets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Uber
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    umap.cpp

HEADERS  += mainwindow.h \
    umap.h

FORMS    += mainwindow.ui

RESOURCES += \
    resource.qrc

DISTFILES += \
    google_maps.html \
    main.js \
    main.css \
    keen.js \
    main.kml \
    khortytsia.kml
