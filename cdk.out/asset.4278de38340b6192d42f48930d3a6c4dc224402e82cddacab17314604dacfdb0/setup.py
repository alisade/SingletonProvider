import setuptools

setuptools.setup(
    name="s3_bucket_singleton",
    version="0.0.1",
    py_modules=["s3_bucket_singleton"],
    install_requires=[
        "boto3",
        "cfnresponse"
    ],
)
