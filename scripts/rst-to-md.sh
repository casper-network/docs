cd ../docs
find . -depth -type f -name '*.rst' | while read line; do
    echo "Converting '$line'"
    pandoc "$line" -f rst -t markdown -o "${line%.*}.md";
    rm $line
done
yarn run:prettier