import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import {
  completeHandler,
  directories,
  download,
  DownloadTask
} from '@kesha-antonov/react-native-background-downloader';

const WAIT_BEFORE_PAUSE = true;

function App(): JSX.Element {
  const [downloading, setDownloading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [task, setTask] = useState<DownloadTask | undefined>();

  function onDownload() {
    setDownloading(true);

    const id = 'file' + Math.random().toFixed(3);
    const task = download({
      id,
      url: 'https://wavez-prod-podcache.storage.googleapis.com/https___feeds_simplecast_com_3hnxp7yk/6ee807f6_336d_46f6_b6e3_6936e16c525c.mp3',
      destination: `${directories.documents}/${id}.mp3}`,
    });

    task
      .begin((data: {expectedBytes: number}) => {
        console.log('Download started', data.expectedBytes);

        // Pausing here actually always works.
        // pauseTask(task);
      })
      .done(() => {
        completeHandler(task.id);
        console.log('Download finished');
      })
      .error((error, errorCode) => {
        console.log('Download error', error, errorCode);
      })
      .progress((percent: number, bytesWritten: number, totalBytes: number) => {
        console.log('Download progress', percent, bytesWritten, totalBytes);
      });

    // Pausing here only works if you wait a while. Instantly pausing doesn't
    // do anything.
    if (WAIT_BEFORE_PAUSE) {
      setTimeout(() => pauseTask(task), 250);
    } else {
      pauseTask(task);
    }

    setTask(task);
  }

  function pauseTask(task?: DownloadTask) {
    console.log('Attempting to pause download with task:', !!task);
    task?.pause();
    setPaused(true);
  }

  function onResume() {
    console.log('Attempting to resume download.');
    task?.resume();
    setPaused(false);
  }

  return (
    <View style={styles.container}>
      <Button
        disabled={downloading}
        onPress={onDownload}
        title="Press to Download"
      />
      {downloading && (
        <>
          <Text>Downloading...</Text>
          <Button
            disabled={paused}
            onPress={() => pauseTask(task)}
            title="Pause Download"
          />
          <Button
            disabled={!paused}
            onPress={onResume}
            title="Resume Download"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
