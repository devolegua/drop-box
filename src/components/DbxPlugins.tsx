import React from 'react'

function DbxPlugins() {
  // useEffect(() => {
  //   (global as any).Dropbox.choose(dpOptions);
  // }, [])

  return (
    <div className="DbxPlugins">
      <div
        className="dropbox-chooser dropbox-dropin-btn dropbox-dropin-default"
        onClick={triggerUploadDropbox}
      >
        Upload to Dropbox
      </div>
      <div
        className="dropbox-saver dropbox-dropin-btn dropbox-dropin-default"
        onClick={trigggerSaveDropbox}
      >
        Save to Dropbox
      </div>
    </div>
  )
}

function triggerUploadDropbox() {
  const dpOptions = {
    success: function (files: any) {
      console.log(files)
    },
    linkType: 'direct'
  }

  ;(global as any).Dropbox.choose(dpOptions)
}

function trigggerSaveDropbox() {
  const dpOptions = {
    success: function (files: any) {
      console.log(files)
    },
  }

  ;(global as any).Dropbox.save(dpOptions)
}

export default DbxPlugins
