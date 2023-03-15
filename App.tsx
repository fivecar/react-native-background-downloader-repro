import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import {
  completeHandler,
  directories,
  download,
  DownloadTask
} from '@kesha-antonov/react-native-background-downloader';

function App(): JSX.Element {
  const [downloading, setDownloading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [task, setTask] = useState<DownloadTask | undefined>();

  function onDownload() {
    setDownloading(true);

    const task = download({
      id: 'file123',
      url: 'https://wavez-prod-podcache.storage.googleapis.com/https___feeds_simplecast_com_3hnxp7yk/6ee807f6_336d_46f6_b6e3_6936e16c525c.mp3',
      destination: `${directories.documents}/test.jpg`,
    });

    task
      .begin((data: {expectedBytes: number}) => {
        console.log('Download started', data.expectedBytes);
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

    setTask(task);
  }

  function onPause() {
    console.log('Attempting to pause download.');
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
          <Button disabled={paused} onPress={onPause} title="Pause Download" />
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
