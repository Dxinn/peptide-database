import csv
import chardet

# 检测文件编码
with open('data/peptides.csv', 'rb') as f:
    encoding = chardet.detect(f.read())['encoding']
    print(f"文件编码: {encoding}")

# 读取CSV内容
try:
    with open('data/peptides.csv', 'r', encoding=encoding) as f:
        reader = csv.reader(f)
        rows = list(reader)
        
        print(f"总行数: {len(rows)}")
        print(f"表头列数: {len(rows[0])}")
        print("表头内容:")
        for i, header in enumerate(rows[0]):
            print(f"  列{i+1}: {header}")
            
        # 检查前几行数据的列数是否一致
        for i in range(1, min(4, len(rows))):
            print(f"第{i+1}行列数: {len(rows[i])}")
            
except Exception as e:
    print(f"错误: {e}")
