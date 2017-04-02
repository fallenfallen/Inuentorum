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
    umap.cpp \
    uqt.cpp \
    uassessor.cpp

HEADERS  += mainwindow.h \
    umap.h \
    uqt.h \
    uassessor.h

FORMS    += mainwindow.ui

RESOURCES += \
    resource.qrc

DISTFILES += \
    google_maps.html \
    main.js \
    main.css \
    keen.js \
    qwebchannel.js

QMAKE_CXXFLAGS += -std=c++11 -Wall -Werror
