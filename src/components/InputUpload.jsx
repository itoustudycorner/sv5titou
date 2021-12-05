import { Upload, Button, Progress, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { taskEvent, upFileApi } from '../api/firebaseStorage';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const initInputUpload = {
	onUploadSuccess: true,
	onUploadStart: false,
	onUploadError: null,
	uploadProgress: 0,
};

const options = {
	maxSizeMB: 1,
	maxWidthOrHeight: 1920,
	useWebWorker: true,
};

function InputUpload({ text, id, ...props }) {
	const [inputUpload, setInputUpload] = useState(initInputUpload);

	const setState = (name, value) => {
		setInputUpload((s) => ({ ...s, [name]: value }));
	};

	const handleBeforeUpload = (file) => {
		const isLt5M = file.size / 1024 / 1024 < 5;
		if (!isLt5M) {
			message.error('Ảnh phải nhỏ hơn 5MB!');
			return false;
		}
		if (props.handleBeforeUpload) return props.handleBeforeUpload(file);
		return true;
	};
	const compressImage = async (file) => {
		options.onProgress = (percent) => {
			setState('onUploadStart', true);
			setState('uploadProgress', Math.round(percent / 2));
		};
		return imageCompression(file, options)
			.then(function (compressedFile) {
				console.log(
					'compressedFile instanceof Blob',
					compressedFile instanceof Blob
				); // true
				console.log(
					`compressedFile size ${
						compressedFile.size / 1024 / 1024
					} MB`
				); // smaller than maxSizeMB

				return compressedFile;
			})
	};
	const handleUpload = async (data) => {
		console.log('data file is', data);
		let file = null;
		if (data.file.type.indexOf('image') !== -1)
			file = await compressImage(data.file);
		else file = data.file;
		const task = upFileApi(id, file);
		task.on(
			taskEvent,
			(snapshot) => {
				const progress = Math.round(
					(100 * snapshot.bytesTransferred) / snapshot.totalBytes / 2
				);
				setState('onUploadStart', true);
				setState('uploadProgress', progress);
			},
			(error) => {
				message.error('Có lỗi xảy ra vui lòng thử lại');
				setState('onUploadError', error);
				setState('onUploadSuccess', false);
			},
			() => {
				setState('onUploadSuccess', true);
				setState('onUploadStart', false);
			}
		);
		if (props.handleAfterUpload)
			task.then((snapshot) => {
				snapshot.ref.getDownloadURL().then((url) => {
					props.handleAfterUpload(url, snapshot);
				});
			});
	};
	return (
		<>
			<Upload
				name={props.name ? props.name : 'upload-image'}
				style={{ display: 'inline-block' }}
				customRequest={handleUpload}
				beforeUpload={handleBeforeUpload}
				listType="picture"
				multiple={false}
				showUploadList={false}
			>
				<Button
					type="primary"
					icon={<UploadOutlined />}
					loading={inputUpload.onUploadStart}
					disabled={props.disabled}
				>
					{text || 'Thêm file'}
				</Button>
			</Upload>
			{inputUpload.onUploadStart && (
				<Progress
					steps={5}
					size="small"
					strokeColor="#66ee22"
					percent={inputUpload.uploadProgress}
				/>
			)}
		</>
	);
}

export default InputUpload;
