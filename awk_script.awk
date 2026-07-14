BEGIN {
    FS = " - ";
}
{
    # Determine type
    if ($1 ~ /error/) {
        type = "error";
    } else if ($1 ~ /warning/) {
        type = "warning";
    } else {
        next;
    }
    # $2 is the message, we don't need it for counting
    # $3 is the file path with line and column: e.g., "apps\customer-mobile\lib\features\notifications\data\datasource\notification_remote_data_source_impl.dart:9:7"
    # Split $3 by ":" to get the file path (first part)
    split($3, parts, ":");
    filepath = parts[1];
    # Now extract feature from filepath
    # Replace backslashes with slashes for easier splitting
    gsub(/\/, "/", filepath);
    # Split by "/"
    split(filepath, dirs, "/");
    # Find the index of "features"
    feature = "unknown";
    for (i in dirs) {
        if (dirs[i] == "features") {
            # The next element is the feature name
            if ((i+1) in dirs) {
                feature = dirs[i+1];
                break;
            }
        }
    }
    # Increment counters
    if (type == "error") {
        errors[feature]++;
    } else {
        warnings[feature]++;
    }
    total[feature]++;
}
END {
    print "Feature,Errors,Warnings,Total";
    for (f in total) {
        printf "%s,%d,%d,%d\n", f, errors[f]+0, warnings[f]+0, total[f]+0;
    }
}
