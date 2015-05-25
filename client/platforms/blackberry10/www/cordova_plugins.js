cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.phonostar.softkeyboard/www/softkeyboard.js",
        "id": "de.phonostar.softkeyboard.SoftKeyboard",
        "clobbers": [
            "SoftKeyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/contacts.js",
        "id": "org.apache.cordova.contacts.contacts",
        "clobbers": [
            "navigator.contacts"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/Contact.js",
        "id": "org.apache.cordova.contacts.Contact",
        "clobbers": [
            "Contact"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactAddress.js",
        "id": "org.apache.cordova.contacts.ContactAddress",
        "clobbers": [
            "ContactAddress"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactError.js",
        "id": "org.apache.cordova.contacts.ContactError",
        "clobbers": [
            "ContactError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactField.js",
        "id": "org.apache.cordova.contacts.ContactField",
        "clobbers": [
            "ContactField"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactFindOptions.js",
        "id": "org.apache.cordova.contacts.ContactFindOptions",
        "clobbers": [
            "ContactFindOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactName.js",
        "id": "org.apache.cordova.contacts.ContactName",
        "clobbers": [
            "ContactName"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactOrganization.js",
        "id": "org.apache.cordova.contacts.ContactOrganization",
        "clobbers": [
            "ContactOrganization"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactFieldType.js",
        "id": "org.apache.cordova.contacts.ContactFieldType",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraConstants.js",
        "id": "org.apache.cordova.camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/Camera.js",
        "id": "org.apache.cordova.camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file-transfer/www/FileTransferError.js",
        "id": "org.apache.cordova.file-transfer.FileTransferError",
        "clobbers": [
            "window.FileTransferError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file-transfer/www/FileTransfer.js",
        "id": "org.apache.cordova.file-transfer.FileTransfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file-transfer/www/blackberry10/FileTransferProxy.js",
        "id": "org.apache.cordova.file-transfer.FileTransferProxy",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file-transfer/www/blackberry10/xhrFileTransfer.js",
        "id": "org.apache.cordova.file-transfer.xhrFileTransfer"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/DirectoryEntry.js",
        "id": "org.apache.cordova.file.DirectoryEntry",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/DirectoryReader.js",
        "id": "org.apache.cordova.file.DirectoryReader",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/Entry.js",
        "id": "org.apache.cordova.file.Entry",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/File.js",
        "id": "org.apache.cordova.file.File",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileEntry.js",
        "id": "org.apache.cordova.file.FileEntry",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileError.js",
        "id": "org.apache.cordova.file.FileError",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileReader.js",
        "id": "org.apache.cordova.file.FileReader",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileSystem.js",
        "id": "org.apache.cordova.file.FileSystem",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileUploadOptions.js",
        "id": "org.apache.cordova.file.FileUploadOptions",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileUploadResult.js",
        "id": "org.apache.cordova.file.FileUploadResult",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/FileWriter.js",
        "id": "org.apache.cordova.file.FileWriter",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/Flags.js",
        "id": "org.apache.cordova.file.Flags",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/LocalFileSystem.js",
        "id": "org.apache.cordova.file.LocalFileSystem",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/Metadata.js",
        "id": "org.apache.cordova.file.Metadata",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/ProgressEvent.js",
        "id": "org.apache.cordova.file.ProgressEvent",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/fileSystems.js",
        "id": "org.apache.cordova.file.fileSystems"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/requestFileSystem.js",
        "id": "org.apache.cordova.file.requestFileSystem",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/resolveLocalFileSystemURI.js",
        "id": "org.apache.cordova.file.resolveLocalFileSystemURI",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/FileProxy.js",
        "id": "org.apache.cordova.file.FileProxy",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/info.js",
        "id": "org.apache.cordova.file.bb10FileSystemInfo",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/createEntryFromNative.js",
        "id": "org.apache.cordova.file.bb10CreateEntryFromNative",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/requestAnimationFrame.js",
        "id": "org.apache.cordova.file.bb10RequestAnimationFrame",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/FileSystem.js",
        "id": "org.apache.cordova.file.bb10FileSystem",
        "merges": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/fileSystems-roots.js",
        "id": "org.apache.cordova.file.fileSystems-roots",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.file/www/fileSystemPaths.js",
        "id": "org.apache.cordova.file.fileSystemPaths",
        "merges": [
            "cordova"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/copyTo.js",
        "id": "org.apache.cordova.file.copyToProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/getDirectory.js",
        "id": "org.apache.cordova.file.getDirectoryProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/getFile.js",
        "id": "org.apache.cordova.file.getFileProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/getFileMetadata.js",
        "id": "org.apache.cordova.file.getFileMetadataProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/getMetadata.js",
        "id": "org.apache.cordova.file.getMetadataProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/getParent.js",
        "id": "org.apache.cordova.file.getParentProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/moveTo.js",
        "id": "org.apache.cordova.file.moveToProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/readAsArrayBuffer.js",
        "id": "org.apache.cordova.file.readAsArrayBufferProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/readAsBinaryString.js",
        "id": "org.apache.cordova.file.readAsBinaryStringProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/readAsDataURL.js",
        "id": "org.apache.cordova.file.readAsDataURLProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/readAsText.js",
        "id": "org.apache.cordova.file.readAsTextProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/readEntries.js",
        "id": "org.apache.cordova.file.readEntriesProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/remove.js",
        "id": "org.apache.cordova.file.removeProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/removeRecursively.js",
        "id": "org.apache.cordova.file.removeRecursivelyProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/resolveLocalFileSystemURI.js",
        "id": "org.apache.cordova.file.resolveLocalFileSystemURIProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/requestAllFileSystems.js",
        "id": "org.apache.cordova.file.requestAllFileSystemsProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/requestFileSystem.js",
        "id": "org.apache.cordova.file.requestFileSystemProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/setMetadata.js",
        "id": "org.apache.cordova.file.setMetadataProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/truncate.js",
        "id": "org.apache.cordova.file.truncateProxy"
    },
    {
        "file": "plugins/org.apache.cordova.file/www/blackberry10/write.js",
        "id": "org.apache.cordova.file.writeProxy"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "de.phonostar.softkeyboard": "0.1.1",
    "org.apache.cordova.contacts": "0.2.15",
    "org.apache.cordova.camera": "0.3.6",
    "org.apache.cordova.device": "0.3.0",
    "org.apache.cordova.file-transfer": "0.5.0",
    "com.blackberry.utils": "2.1.0",
    "com.blackberry.pim.lib": "2.1.0",
    "org.apache.cordova.file": "1.3.3"
}
// BOTTOM OF METADATA
});