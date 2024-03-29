/*
* Copyright (C) 2007 Benjamin C Meyer
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * The name of the contributors may not be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY <copyright holder> ``AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#include <QtScript>
#include "profiler.h"

int main(int argc, char **argv)
{
    QCoreApplication::setApplicationName(argv[0]);
    if (argc < 2) {
        fprintf(stderr, "*** you must specify a script file to evaluate (try example.qs)\n");
        return(-1);
    }

    QScriptEngine engine;
    Profiler *profiler = new Profiler(&engine);
    engine.setAgent(profiler);

    // read in all files and try to execute them
    for (int i = 1; i < argc; ++i) {
        QString fileName = QString::fromLatin1(argv[i]);
        QFile file(fileName);
        if (file.open(QFile::ReadOnly)) {
            QString code = QTextStream(&file).readAll();
            file.close();
            engine.evaluate(code, fileName);
            if (engine.hasUncaughtException()) {
                QTextStream out(stderr);
                out << "In file: " << fileName << " Uncaught exception: " << engine.uncaughtExceptionLineNumber() << endl;
                out << "backtrace: " << engine.uncaughtExceptionBacktrace().join(",") << endl;
                return -1;
            }
        } else {
            fprintf(stderr, "*** failed to open `%s' for reading\n", argv[i]);
            return -1;
        }
    }
    return 0;
}
