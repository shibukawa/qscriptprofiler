TEMPLATE = app
TARGET = qsprofiler
DEPENDPATH += .
INCLUDEPATH += .
QT += script
win32: CONFIG += console
mac: CONFIG -= app_bundle

SOURCES += main.cpp
DESTDIR = ../

include(qsprofiler.pri)
