#include "pixleEditor.h"
#include <QPainter>
#include <QDebug>

PixleEditor::PixleEditor(QObject *parent) : QObject(parent), currentTool("Pencil"), toolSize(1) {}

void PixleEditor::setTool(const QString& toolName) {
    currentTool = toolName;
    qDebug() << "Tool set to:" << currentTool;
}

void PixleEditor::setToolSize(int size) {
    if (size > 0) {
        toolSize = size;
        qDebug() << "Tool size set to:" << toolSize;
    } else {
        qDebug() << "Invalid tool size. Size must be positive.";
    }
}

